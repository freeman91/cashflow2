from datetime import datetime, timezone
from flask import Blueprint, request

from services.dynamo import (
    Recurring,
    ExpenseAttributes,
    RepaymentAttributes,
    PaycheckAttributes,
    IncomeAttributes,
)
from services.api.controllers.__util__ import (
    failure_result,
    handle_exception,
    success_result,
)


recurrings = Blueprint("recurrings", __name__)


@handle_exception
@recurrings.route("/recurrings/<user_id>", methods=["POST", "GET"])
def _recurrings(user_id: str):
    if request.method == "POST":
        body = request.json

        interval = body.get("interval")
        day_of_week = body.get("day_of_week")
        day_of_month = body.get("day_of_month")
        month_of_year = body.get("month_of_year")
        next_date = body.get("next_date")
        if next_date:
            next_date = datetime.strptime(next_date[:19], "%Y-%m-%dT%H:%M:%S")

        recurring = Recurring.create(
            user_id=user_id,
            item_type=body.get("item_type"),
            name=body.get("name"),
            frequency=body.get("frequency"),
            interval=int(interval) if interval else None,
            day_of_week=int(day_of_week) if day_of_week else None,
            day_of_month=int(day_of_month) if day_of_month else None,
            month_of_year=int(month_of_year) if month_of_year else None,
            next_date=next_date,
            expense_attributes=body.get("expense_attributes"),
            repayment_attributes=body.get("repayment_attributes"),
            paycheck_attributes=body.get("paycheck_attributes"),
            income_attributes=body.get("income_attributes"),
        )
        return success_result(recurring.as_dict())

    if request.method == "GET":
        return success_result(
            [recurring.as_dict() for recurring in Recurring.list(user_id=user_id)]
        )
    return failure_result()


@handle_exception
@recurrings.route(
    "/recurrings/<user_id>/<recurring_id>", methods=["GET", "PUT", "DELETE"]
)
def _recurring(user_id: str, recurring_id: str):
    if request.method == "GET":
        return success_result(
            Recurring.get_(user_id=user_id, recurring_id=recurring_id).as_dict()
        )

    if request.method == "PUT":
        recurring = Recurring.get_(user_id=user_id, recurring_id=recurring_id)
        payload = request.json
        next_date = payload.get("next_date")
        if next_date:
            recurring.next_date = datetime.strptime(next_date[:19], "%Y-%m-%dT%H:%M:%S")

        item_type = payload.get("item_type")
        if item_type == "expense":
            recurring.expense_attributes = ExpenseAttributes.parse(
                payload.get("expense_attributes") or {}
            )
        elif item_type == "repayment":
            recurring.repayment_attributes = RepaymentAttributes.parse(
                payload.get("repayment_attributes") or {}
            )
        elif item_type == "paycheck":
            recurring.paycheck_attributes = PaycheckAttributes.parse(
                payload.get("paycheck_attributes") or {}
            )
        elif item_type == "income":
            recurring.income_attributes = IncomeAttributes.parse(
                payload.get("income_attributes") or {}
            )

        for attr in ["item_type", "name", "day", "months", "frequency"]:
            setattr(recurring, attr, payload.get(attr))

        for attr in [
            "interval",
            "day_of_week",
            "day_of_month",
            "month_of_year",
            "week_interval",
        ]:
            if attr in payload:
                setattr(recurring, attr, int(payload.get(attr)))

        recurring.last_update = datetime.now(timezone.utc)
        recurring.save()
        return success_result(recurring.as_dict())

    if request.method == "DELETE":
        Recurring.get_(user_id=user_id, recurring_id=recurring_id).delete()
        return success_result(f"{recurring_id} deleted")

    return failure_result()
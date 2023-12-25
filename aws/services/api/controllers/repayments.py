from datetime import datetime, timedelta
from flask import Blueprint, request

from services import dynamo
from services.api.controllers.__util__ import (
    failure_result,
    handle_exception,
    success_result,
)

repayments = Blueprint("repayments", __name__)


@handle_exception
@repayments.route("/repayments/<user_id>", methods=["POST", "GET"])
def _repayments(user_id: str):
    if request.method == "POST":
        body = request.json
        _date = datetime.strptime(body["date"][:19], "%Y-%m-%dT%H:%M:%S")
        repayment = dynamo.repayment.create(
            user_id=user_id,
            _date=_date,
            principal=float(body.get("principal")),
            interest=float(body.get("interest")),
            lender=body.get("lender"),
            debt_id=body.get("debt_id"),
            bill_id=body.get("bill_id"),
        )
        return success_result(repayment.as_dict())

    if request.method == "GET":
        start = datetime.strptime(request.args.get("start"), '%Y-%m-%d')
        end = datetime.strptime(request.args.get("end"), '%Y-%m-%d') + timedelta(hours=24)
        return success_result(
            [repayment.as_dict() for repayment in dynamo.repayment.search(user_id=user_id, start=start, end=end)]
        )

    return failure_result()


@handle_exception
@repayments.route(
    "/repayments/<user_id>/<repayment_id>", methods=["GET", "PUT", "DELETE"]
)
def _repayment(user_id: str, repayment_id: str):
    if request.method == "GET":
        return success_result(
            dynamo.repayment.get(user_id=user_id, repayment_id=repayment_id).as_dict()
        )

    if request.method == "PUT":
        repayment = dynamo.repayment.get(user_id=user_id, repayment_id=repayment_id)
        repayment.date = datetime.strptime(
            request.json["date"][:19], "%Y-%m-%dT%H:%M:%S"
        )
        repayment.principal = float(request.json.get("principal"))
        repayment.interest = float(request.json.get("interest"))

        for attr in [
            "lender",
            "debt_id",
            "bill_id",
        ]:
            setattr(repayment, attr, request.json.get(attr))

        repayment.save()
        return success_result(repayment.as_dict())

    if request.method == "DELETE":
        dynamo.repayment.get(user_id=user_id, repayment_id=repayment_id).delete()
        return success_result(f"{repayment_id} deleted")

    return failure_result()

from datetime import datetime
from flask import Blueprint, request

from services.dynamo import Sale
from services.api.controllers.__util__ import (
    failure_result,
    handle_exception,
    success_result,
)

sales = Blueprint("sales", __name__)


@handle_exception
@sales.route("/sales/<user_id>", methods=["POST", "GET"])
def _sales(user_id: str):
    if request.method == "POST":
        body = request.json
        _date = datetime.strptime(body["date"][:19], "%Y-%m-%dT%H:%M:%S")
        sale = Sale.create(
            user_id=user_id,
            _date=_date,
            amount=float(body.get("amount")),
            shares=float(body.get("shares")),
            price=float(body.get("price")),
            asset_id=body.get("asset_id"),
            vendor=body.get("vendor"),
            fee=float(body.get("fee")),
            deposit_to_id=body.get("deposit_to_id"),
        )

        if sale.asset_id:
            withdraw_asset = sale.withdraw()
            withdraw_asset = withdraw_asset.as_dict()

        if sale.deposit_to_id:
            deposit_asset = sale.deposit()
            deposit_asset = deposit_asset.as_dict()

        return success_result(
            {
                "sale": sale.as_dict(),
                "deposit_asset": deposit_asset,
                "withdraw_asset": withdraw_asset,
            }
        )

    if request.method == "GET":
        return success_result([sale.as_dict() for sale in Sale.list(user_id=user_id)])
    return failure_result()


@handle_exception
@sales.route("/sales/<user_id>/<sale_id>", methods=["GET", "PUT", "DELETE"])
def _sale(user_id: str, sale_id: str):
    if request.method == "GET":
        return success_result(Sale.get_(user_id=user_id, sale_id=sale_id).as_dict())

    if request.method == "PUT":
        sale = Sale.get_(user_id=user_id, sale_id=sale_id)
        sale.date = datetime.strptime(request.json["date"][:19], "%Y-%m-%dT%H:%M:%S")
        sale.amount = float(request.json.get("amount"))
        sale.shares = float(request.json.get("shares"))
        sale.price = float(request.json.get("price"))
        sale.fee = float(request.json.get("fee"))

        for attr in ["asset_id", "vendor", "deposit_to_id"]:
            setattr(sale, attr, request.json.get(attr))

        sale.save()
        return success_result(sale.as_dict())

    if request.method == "DELETE":
        Sale.get_(user_id=user_id, sale_id=sale_id).delete()
        return success_result(f"{sale_id} deleted")

    return failure_result()

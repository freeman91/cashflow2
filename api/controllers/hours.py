from flask import request, Blueprint

from api.db.hours import Hours
from api.controllers.__util__ import serialize_dict, success_result, failure_result

hours = Blueprint("hours", __name__)


@hours.route("/hours", methods=["POST"])
def _create_hour():
    try:
        return success_result(Hours.get(Hours.create(request.json).inserted_id))
    except Exception as err:
        print(f"err: {err}")
        return failure_result("Bad Request")


@hours.route("/hours/<string:id>", methods=["GET", "PUT", "DELETE"])
def _hours(id: str):
    try:
        if request.method == "GET":
            # if does not exist send back 400 error
            return success_result(Hours.get(id))

        if request.method == "PUT":
            hour = request.json
            Hours.update(hour)
            return success_result(Hours.get(hour["_id"]))

        if request.method == "DELETE":
            Hours.delete(id)
            return "Expense deleted", 200
    except Exception as err:
        print(f"err: {err}")
        return failure_result("Bad Request")


@hours.route("/hours/range/<start>/<end>", methods=["GET"])
def _hours_in_range(start: str, end: str):
    try:
        if not (start.isnumeric() and end.isnumeric()):
            return {"result": "Invalid range"}, 400

        success_result(
            [serialize_dict(hour) for hour in Hours.in_range(int(start), int(end))]
        )
    except Exception as err:
        print(f"err: {err}")
        return failure_result("Bad Request")

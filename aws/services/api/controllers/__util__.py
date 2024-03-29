# pylint: disable = broad-except
"""controller utility functions"""

import traceback
from datetime import datetime
from http import HTTPStatus
from pydash import set_


def success_result(payload, status_code: HTTPStatus = HTTPStatus.OK):
    return {"result": payload}, status_code


def failure_result(
    message: str = "Bad Request", status_code: HTTPStatus = HTTPStatus.BAD_REQUEST
):
    return {"result": message}, status_code


def set_date(item: dict):
    return set_(
        item,
        "date",
        datetime.strptime(item["date"], "%m-%d-%Y").replace(hour=12),
    )


def handle_exception(func):
    """wrap the function in a try/except block"""

    def wrap(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception as err:
            traceback.print_exc()
            return failure_result(
                f"Action unsuccessful: {err}",
                status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
            )

    return wrap

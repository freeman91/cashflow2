import os
from pprint import pprint
from datetime import datetime
from cryptocompare import cryptocompare
from yahoo_fin import stock_info

os.environ["WB_DOMAIN"] = "localhost"
os.environ["WB_PORT"] = "27017"

from api.db import CRYPTO_KEY, database as db
from api.db.user import user
from api.db.expenses import Expenses
from api.db.incomes import Incomes
from api.db.hours import Hours
from api.db.assets import Assets
from api.db.debts import Debts
from api.db.goals import Goals
from api.db.networths import Networths

cryptocompare._set_api_key_parameter(CRYPTO_KEY)


def g_goal():
    goal = {
        "date": datetime(2021, 6, 1),
        "month": 6,
        "year": 2021,
        "values": {"food": 150.0, "grocery": 400.0},
        "description": "",
    }

    Goals.create(goal)


def g_nw():
    goal = {
        "date": datetime(2021, 6, 30),
        "month": 6,
        "year": 2021,
        "assets": {"bitcoin": 1800.0, "chevy malibu": 4000.0},
        "debts": {"huntington": 150.0, "tuition": 29000.0},
    }

    Networths.create(goal)


def delete_all():
    Expenses.delete_all()
    Incomes.delete_all()
    Hours.delete_all()


def get_crypto_prices(tickers: list):
    return cryptocompare.get_price(tickers, currency="USD")


def get_stock_price(ticker: str):
    return stock_info.get_live_price(ticker.upper())


def print_all():
    pprint(Expenses.get_all())
    pprint(Incomes.get_all())
    pprint(Hours.get_all())
    pprint(Goals.get_all())
    pprint(Networths.get_all())
    pprint(Assets.get_all())
    pprint(Debts.get_all())


if __name__ == "__main__":
    pass

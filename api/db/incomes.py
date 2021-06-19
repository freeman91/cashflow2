from datetime import datetime

from api.db import database as db
from api.db.user import user


class IncomesModel:
    name = "income"
    types = user.item[name]["types"]
    sources = user.item[name]["sources"]
    deduction_types = user.item[name]["deductions"]
    attributes = {
        "date": datetime,
        "amount": float,
        "deductions": dict,
        "type": str,
        "source": str,
        "asset": str,
        "desc": str,
    }

    def get(self, id):
        return db.incomes.find_one({"_id": id})

    def find_one(self):
        return db.incomes.find_one()

    def in_range(self, start: str, end: str):
        pass

    def get_all(self):
        return [income for income in db.incomes.find()]

    def create(self, income: dict):
        return db.incomes.insert_one(self.__validate__(**income))

    def update(self, income: dict):
        return db.incomes.replace_one(
            {"_id": income["_id"]}, self.__validate__(**income)
        )

    def delete(self, id):
        return db.incomes.delete_one({"_id": id})

    def delete_all(self):
        return db.incomes.delete_many({})

    def __validate__(self, **income):
        for attr in income:
            if attr == "_id":
                continue
            assert attr in self.attributes
            assert type(income[attr]) == self.attributes[attr]

        self.__verify_type__(income["type"])
        self.__verify_source__(income["source"])
        self.__verify_deduction_types__(income["deductions"])

        return income

    def __verify_type__(self, _type: str):
        if _type not in self.types:
            user.update_income("types", self.types + [_type])

    def __verify_source__(self, source: str):
        if source not in self.sources:
            user.update_income("sources", self.sources + [source])

    def __verify_deduction_types__(self, deduction_types: dict):
        for _type in deduction_types:
            assert type(_type) == str
            assert type(deduction_types[_type]) == float
            assert _type in self.deduction_types


Incomes = IncomesModel()

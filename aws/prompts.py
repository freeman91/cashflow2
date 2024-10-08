"""Prompt user to select resource"""

from typing import List
import inquirer
from pydash import sort_by, find

from services.dynamo import (
    Account,
    Asset,
    Bill,
    Borrow,
    Debt,
    Expense,
    Income,
    Networth,
    OptionList,
    Paycheck,
    Purchase,
    Repayment,
    Sale,
    User,
)


def resource(resources: List, resource_type: str):
    if len(resources) == 1:
        return resources[0].get("value")

    _resource = inquirer.prompt(
        [
            inquirer.List(
                "RESOURCE",
                message=f"Select {resource_type}",
                choices=[resource["name"] for resource in resources],
                carousel=True,
            )
        ]
    ).get("RESOURCE")

    if not _resource:
        raise ValueError(f"You must select a {resource_type}")

    return find(resources, lambda resource: resource["name"] == _resource).get("value")


def user() -> User:
    users = [
        {"name": f"{user.name} [{user.email}]", "value": user}
        for user in sort_by(User.list(), lambda user: user.name)
    ]

    return resource(users, "User")


def account() -> Account:
    _user = user()
    accounts = [
        {"name": f"{account.name} [{account.account_id}]", "value": account}
        for account in sort_by(Account.list(user_id=_user.user_id), "name")
    ]

    return resource(accounts, "Account")


def asset() -> Asset:
    _user = user()
    assets = [
        {"name": f"{asset.name} [{asset.account_id}]", "value": asset}
        for asset in sort_by(Asset.list(user_id=_user.user_id), "name")
    ]

    return resource(assets, "Asset")


def bill() -> Bill:
    _user = user()
    bills = [
        {"name": f"{bill.name} [{bill.vendor}]", "value": bill}
        for bill in sort_by(Bill.list(user_id=_user.user_id), "name")
    ]

    return resource(bills, "Bill")


def borrow() -> Borrow:
    _user = user()
    borrows = [
        {"name": f"{borrow.name} [{borrow.account_id}]", "value": borrow}
        for borrow in sort_by(Borrow.list(user_id=_user.user_id), "name")
    ]

    return resource(borrows, "Borrow")


def debt() -> Debt:
    _user = user()
    debts = [
        {"name": f"{debt.name} [{debt.account_id}]", "value": debt}
        for debt in sort_by(Debt.list(user_id=_user.user_id), "name")
    ]

    return resource(debts, "Debt")


def expense() -> Expense:
    _user = user()
    expenses = [
        {"name": f"{expense.name} [{expense.account_id}]", "value": expense}
        for expense in sort_by(Expense.list(user_id=_user.user_id), "name")
    ]

    return resource(expenses, "Expense")


def income() -> Income:
    _user = user()
    incomes = [
        {"name": f"{income.name} [{income.account_id}]", "value": income}
        for income in sort_by(Income.list(user_id=_user.user_id), "name")
    ]

    return resource(incomes, "Income")


def networth() -> Networth:
    _user = user()
    networths = [
        {
            "name": f"{networth.year}/{networth.month} [{networth.networth_id}]",
            "value": networth,
        }
        for networth in sort_by(Networth.list(user_id=_user.user_id), ["year", "month"])
    ]

    return resource(networths, "Networth")


def option_list() -> OptionList:
    _user = user()
    option_lists = [
        {"name": f"{option_list.option_type}", "value": option_list}
        for option_list in sort_by(OptionList.list(user_id=_user.user_id), "name")
    ]

    return resource(option_lists, "OptionList")


def paycheck() -> Paycheck:
    _user = user()
    paychecks = [
        {"name": f"{paycheck.name} [{paycheck.account_id}]", "value": paycheck}
        for paycheck in sort_by(Paycheck.list(user_id=_user.user_id), "name")
    ]

    return resource(paychecks, "Paycheck")


def purchase() -> Purchase:
    _user = user()
    purchases = [
        {"name": f"{purchase.name} [{purchase.account_id}]", "value": purchase}
        for purchase in sort_by(Purchase.list(user_id=_user.user_id), "name")
    ]

    return resource(purchases, "Purchase")


def repayment() -> Repayment:
    _user = user()
    repayments = [
        {"name": f"{repayment.name} [{repayment.account_id}]", "value": repayment}
        for repayment in sort_by(Repayment.list(user_id=_user.user_id), "name")
    ]

    return resource(repayments, "Repayment")


def sale() -> Sale:
    _user = user()
    sales = [
        {"name": f"{sale.name} [{sale.account_id}]", "value": sale}
        for sale in sort_by(Sale.list(user_id=_user.user_id), "name")
    ]

    return resource(sales, "Sale")

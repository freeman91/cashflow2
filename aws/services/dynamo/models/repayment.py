"""Repayment pynamodb model"""

import os
from pynamodb.attributes import (
    BooleanAttribute,
    NumberAttribute,
    UnicodeAttribute,
    UTCDateTimeAttribute,
)

from .base import BaseModel

TYPE = "repayment"
ENV: str = os.getenv("ENV")
REGION: str = os.getenv("REGION")
APP_ID: str = os.getenv("APP_ID")


class Repayment(BaseModel):
    class Meta:
        region = REGION
        table_name = f"{APP_ID}-{ENV}-{TYPE}s"

    user_id = UnicodeAttribute(hash_key=True)
    repayment_id = UnicodeAttribute(range_key=True)
    _type = UnicodeAttribute(default=TYPE)

    date = UTCDateTimeAttribute()
    principal = NumberAttribute()
    interest = NumberAttribute()
    escrow = NumberAttribute(null=True)
    lender = UnicodeAttribute()
    pending = BooleanAttribute(default=False)
    category = UnicodeAttribute(default="")
    subcategory = UnicodeAttribute(default="")
    debt_id = UnicodeAttribute()
    bill_id = UnicodeAttribute(null=True)

    def __repr__(self):
        return f"Repayment<{self.user_id}, {self.date}, {self.lender}, {self.principal}, {self.interest}>"

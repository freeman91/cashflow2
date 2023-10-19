"""Income pynamodb model"""

import os
from pynamodb.models import Model
from pynamodb.attributes import NumberAttribute, UnicodeAttribute, UTCDateTimeAttribute


TYPE = "income"
ENV: str = os.getenv("ENV")
REGION: str = os.getenv("REGION")
APP_ID: str = os.getenv("APP_ID")


class Income(Model):
    class Meta:
        table_name = f"{APP_ID}-{ENV}-{TYPE}s"
        region = REGION

    user_id = UnicodeAttribute(hash_key=True)
    income_id = UTCDateTimeAttribute(range_key=True)
    _type = UnicodeAttribute(default=TYPE)

    date = UTCDateTimeAttribute()
    amount = NumberAttribute()
    source = UnicodeAttribute()
    description = UnicodeAttribute(null=True)

    def __repr__(self):
        return f"Income<{self.user_id}, {self.date}, {self.source}, {self.amount}>"

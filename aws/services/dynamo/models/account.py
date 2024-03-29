"""Account pynamodb model"""

import os
from pprint import pformat
from pynamodb.attributes import UnicodeAttribute

from .base import BaseModel


TYPE = "account"
ENV: str = os.getenv("ENV")
REGION: str = os.getenv("REGION")
APP_ID: str = os.getenv("APP_ID")


class Account(BaseModel):
    class Meta:
        region = REGION
        table_name = f"{APP_ID}-{ENV}-{TYPE}s"

    user_id = UnicodeAttribute(hash_key=True)
    account_id = UnicodeAttribute(range_key=True)
    _type = UnicodeAttribute(default=TYPE)

    name = UnicodeAttribute()
    url = UnicodeAttribute(null=True)
    category = UnicodeAttribute(null=True)
    account_type = UnicodeAttribute(null=True)
    description = UnicodeAttribute(null=True)

    def __repr__(self):
        return f"Account<{self.user_id}, {self.name}>"

    def __str__(self):
        return pformat(self.as_dict())

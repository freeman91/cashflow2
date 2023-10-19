"""Asset pynamodb model"""

import os
from pynamodb.models import Model
from pynamodb.attributes import NumberAttribute, UnicodeAttribute, UTCDateTimeAttribute


TYPE = "asset"
ENV: str = os.getenv("ENV")
REGION: str = os.getenv("REGION")
APP_ID: str = os.getenv("APP_ID")


class Asset(Model):
    class Meta:
        table_name = f"{APP_ID}-{ENV}-{TYPE}s"
        region = REGION

    user_id = UnicodeAttribute(hash_key=True)
    asset_id = UnicodeAttribute(range_key=True)
    _type = UnicodeAttribute(default=TYPE)

    account_id = UnicodeAttribute()
    name = UnicodeAttribute()
    value = NumberAttribute()
    shares = NumberAttribute(null=True)
    price = NumberAttribute(null=True)
    vendor = UnicodeAttribute(null=True)
    last_update = UTCDateTimeAttribute(null=True)

    def __repr__(self):
        return f"Asset<{self.user_id}, {self.name}, {self.value}>"

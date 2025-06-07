"""empty message

Revision ID: 4450565713e1
Revises: e3b408371494, f277356d0965
Create Date: 2025-05-06 23:27:11.220805

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '4450565713e1'
down_revision: Union[str, None] = ('e3b408371494', 'f277356d0965')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass

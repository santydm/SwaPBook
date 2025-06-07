"""empty message

Revision ID: a6e08cc85518
Revises: df22fca328af, ef86032ec05c
Create Date: 2025-06-07 15:29:39.900206

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a6e08cc85518'
down_revision: Union[str, None] = ('df22fca328af', 'ef86032ec05c')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass

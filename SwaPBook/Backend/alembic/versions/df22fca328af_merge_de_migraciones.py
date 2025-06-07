"""Merge de migraciones

Revision ID: df22fca328af
Revises: a3f14893d6ce, ef8ee7db9a68
Create Date: 2025-06-03 20:16:02.083299

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'df22fca328af'
down_revision: Union[str, None] = ('a3f14893d6ce', 'ef8ee7db9a68')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass

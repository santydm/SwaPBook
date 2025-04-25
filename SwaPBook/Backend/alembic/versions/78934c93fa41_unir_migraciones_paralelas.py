"""Unir migraciones paralelas

Revision ID: 78934c93fa41
Revises: 036d613deeb5, 201549d1f23c
Create Date: 2025-04-25 14:47:21.037107

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '78934c93fa41'
down_revision: Union[str, None] = ('036d613deeb5', '201549d1f23c')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass

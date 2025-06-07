"""Fusionar revisiones head

Revision ID: 1b50e01f4dff
Revises: 685965ba607b, ed29db677891
Create Date: 2025-04-30 16:40:10.918918

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '1b50e01f4dff'
down_revision: Union[str, None] = ('685965ba607b', 'ed29db677891')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass

"""empty message

Revision ID: 5b77e2764828
Revises: 9ece4e8cbb7c
Create Date: 2025-04-28 22:41:23.570245

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '5b77e2764828'
down_revision: Union[str, None] = '9ece4e8cbb7c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    #op.drop_index('ix_categorias_idCategoria', table_name='categorias')
    #op.drop_table('categorias')
    #op.drop_index('ix_libros_idLibro', table_name='libros')
    #op.drop_table('libros')
    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('libros',
    sa.Column('idLibro', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('titulo', sa.VARCHAR(length=100), autoincrement=False, nullable=False),
    sa.Column('descripcion', sa.TEXT(), autoincrement=False, nullable=True),
    sa.Column('estado', postgresql.ENUM('disponible', 'intercambio', name='estadolibroenum'), autoincrement=False, nullable=False),
    sa.Column('idEstudiante', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('idCategoria', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.ForeignKeyConstraint(['idCategoria'], ['categorias.idCategoria'], name='libros_idCategoria_fkey'),
    sa.ForeignKeyConstraint(['idEstudiante'], ['estudiantes.idEstudiante'], name='libros_idEstudiante_fkey', ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('idLibro', name='libros_pkey')
    )
    op.create_index('ix_libros_idLibro', 'libros', ['idLibro'], unique=False)
    op.create_table('categorias',
    sa.Column('idCategoria', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('nombre', sa.VARCHAR(), autoincrement=False, nullable=False),
    sa.PrimaryKeyConstraint('idCategoria', name='categorias_pkey'),
    sa.UniqueConstraint('nombre', name='categorias_nombre_key')
    )
    op.create_index('ix_categorias_idCategoria', 'categorias', ['idCategoria'], unique=False)
    # ### end Alembic commands ###

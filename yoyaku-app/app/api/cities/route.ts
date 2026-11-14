import { NextResponse } from 'next/server';
import { pool } from '../../../src/lib/db';

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT id, name_ja, name_pt, slug, is_active FROM cities ORDER BY id ASC');
    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao buscar cidades no banco de dados.' }, { status: 500 });
  }
}
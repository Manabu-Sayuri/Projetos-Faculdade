import { pool } from '@/src/lib/db';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> } // <-- 1. Agora tipado como Promise
) {
  try {
    const { slug } = await params; // <-- 2. Adicionado o await aqui!

    // Vai buscar as instituições cruzando com o slug da cidade
    const [institutions] = await pool.query(
      `SELECT i.* 
       FROM institutions i
       JOIN cities c ON i.city_id = c.id
       WHERE c.slug = ?`,
      [slug]
    );

    return NextResponse.json(institutions);
  } catch (error) {
    console.error('Erro ao buscar instituições:', error);
    return NextResponse.json(
      { error: 'Erro ao carregar instituições' },
      { status: 500 }
    );
  }
}
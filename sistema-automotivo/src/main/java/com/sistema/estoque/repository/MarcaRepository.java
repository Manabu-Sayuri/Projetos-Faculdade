package com.sistema.estoque.repository;
import com.sistema.estoque.model.Marca;
import org.springframework.data.jpa.repository.JpaRepository;
public interface MarcaRepository extends JpaRepository<Marca, Long> {Marca findByNome(String nome);}
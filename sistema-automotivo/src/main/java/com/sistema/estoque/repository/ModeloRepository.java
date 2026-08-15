package com.sistema.estoque.repository;
import com.sistema.estoque.model.Modelo;
import org.springframework.data.jpa.repository.JpaRepository;
public interface ModeloRepository extends JpaRepository<Modelo, Long> {Modelo findByNome(String nome);}
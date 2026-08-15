package com.sistema.estoque.repository;

import com.sistema.estoque.model.Veiculo;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface VeiculoRepository extends JpaRepository<Veiculo, Long> {
    // Filtros de busca solicitados no projeto
    List<Veiculo> findByStatusDisponibilidade(String status);
    List<Veiculo> findByAnoFabricacao(Integer ano);
    List<Veiculo> findByModeloNomeContainingIgnoreCase(String modeloNome);
}
package com.sistema.estoque.controller;

import com.sistema.estoque.model.Marca;
import com.sistema.estoque.model.Modelo;
import com.sistema.estoque.model.Veiculo;
import com.sistema.estoque.repository.MarcaRepository;
import com.sistema.estoque.repository.ModeloRepository;
import com.sistema.estoque.repository.VeiculoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/veiculos")
public class VeiculoController {

    @Autowired
    private VeiculoRepository repository;

    @Autowired
    private MarcaRepository marcaRepository;

    @Autowired
    private ModeloRepository modeloRepository;

    // CREATE: Cadastrar veículo com criação inteligente de Marca e Modelo
    @PostMapping
    public Veiculo cadastrar(@RequestBody Veiculo veiculo) {
        // 1. Verifica/Cria a Marca
        String nomeMarca = veiculo.getModelo().getMarca().getNome();
        Marca marca = marcaRepository.findByNome(nomeMarca);
        if (marca == null) {
            marca = new Marca();
            marca.setNome(nomeMarca);
            marca = marcaRepository.save(marca);
        }
        
        // 2. Verifica/Cria o Modelo
        String nomeModelo = veiculo.getModelo().getNome();
        Modelo modelo = modeloRepository.findByNome(nomeModelo);
        if (modelo == null) {
            modelo = new Modelo();
            modelo.setNome(nomeModelo);
            modelo.setMarca(marca);
            modelo = modeloRepository.save(modelo);
        }
        
        // 3. Salva o Veículo
        veiculo.setModelo(modelo);
        return repository.save(veiculo);
    }

    // READ: Consultar todos ou filtrar por status
    @GetMapping
    public List<Veiculo> listar(@RequestParam(required = false) String status) {
        if (status != null) {
            return repository.findByStatusDisponibilidade(status);
        }
        return repository.findAll();
    }

    // READ: Buscar por ID
    @GetMapping("/{id}")
    public ResponseEntity<Veiculo> buscarPorId(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // UPDATE: Atualizar informações (incluindo o preço de venda)
    @PutMapping("/{id}")
    public ResponseEntity<Veiculo> atualizar(@PathVariable Long id, @RequestBody Veiculo dadosAtualizados) {
        return repository.findById(id).map(veiculo -> {
            veiculo.setPreco(dadosAtualizados.getPreco());
            veiculo.setQuilometragem(dadosAtualizados.getQuilometragem());
            veiculo.setStatusDisponibilidade(dadosAtualizados.getStatusDisponibilidade());
            veiculo.setPrecoVenda(dadosAtualizados.getPrecoVenda()); // Registra o preço final da venda
            Veiculo atualizado = repository.save(veiculo);
            return ResponseEntity.ok(atualizado);
        }).orElse(ResponseEntity.notFound().build());
    }

    // DELETE: Remover veículo
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remover(@PathVariable Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
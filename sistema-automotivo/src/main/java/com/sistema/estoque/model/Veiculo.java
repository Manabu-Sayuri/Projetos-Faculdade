package com.sistema.estoque.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
public class Veiculo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Integer anoFabricacao;
    private String cor;
    private BigDecimal preco;
    private BigDecimal precoVenda;
    private Integer quilometragem;
    private String statusDisponibilidade; // Ex: DISPONIVEL, VENDIDO

    @ManyToOne
    @JoinColumn(name = "modelo_id")
    private Modelo modelo;

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Integer getAnoFabricacao() { return anoFabricacao; }
    public void setAnoFabricacao(Integer anoFabricacao) { this.anoFabricacao = anoFabricacao; }
    public String getCor() { return cor; }
    public void setCor(String cor) { this.cor = cor; }
    public BigDecimal getPreco() { return preco; }
    public void setPreco(BigDecimal preco) { this.preco = preco; }
    public Integer getQuilometragem() { return quilometragem; }
    public void setQuilometragem(Integer quilometragem) { this.quilometragem = quilometragem; }
    public String getStatusDisponibilidade() { return statusDisponibilidade; }
    public void setStatusDisponibilidade(String status) { this.statusDisponibilidade = status; }
    public Modelo getModelo() { return modelo; }
    public void setModelo(Modelo modelo) { this.modelo = modelo; }
    public BigDecimal getPrecoVenda() { return precoVenda; }
    public void setPrecoVenda(BigDecimal precoVenda) { this.precoVenda = precoVenda; }
}
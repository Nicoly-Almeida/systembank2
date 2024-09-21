import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Conta } from 'src/app/shared/models/conta';
import { SaqueDeposito } from 'src/app/shared/models/saqueDeposito';
import { ClienteService } from 'src/app/shared/services/cliente/cliente.service';
import { ContaService } from 'src/app/shared/services/conta/conta.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-deposito-conta',
  templateUrl: './deposito-conta.component.html',
  styleUrls: ['./deposito-conta.component.scss']
})
export class DepositoContaComponent {
  formGroup: FormGroup;
  contas: Conta[]


  constructor(private contaService: ContaService, private router: Router, private clienteService: ClienteService){


    this.formGroup = new FormGroup({
      valor: new FormControl('', Validators.required),
      conta: new FormControl('', Validators.required)
    });
    this.contas = []
  }
  ngOnInit(): void {
    this.listarContas()
  }


  listarContas(): void{
    this.contaService.listar().subscribe(contas => {
      this.clienteService.listar().subscribe(clientes => {
        const contasComNomesDeClientes = contas.map(conta => {
          const cliente = clientes.find(cliente => cliente.id === conta.cliente);
          if (cliente) {
            conta.nomeCliente = cliente.nome;
          }
          return conta;
        });
        this.contas = contasComNomesDeClientes;
      });
    })
  }


  cadastrar() {
    const deposito: SaqueDeposito = this.formGroup.value;
      // Modo de criação
      this.contaService.deposito(deposito).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Sucesso',
            text: 'Depósito registrado com sucesso!',
            showConfirmButton: false,
            timer: 1500
          })
          this.router.navigate(['/conta']);
        },
        error: (error) => {
          console.error(error);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Erro ao registrar depósito!',
          });
        }
      });
    }
}


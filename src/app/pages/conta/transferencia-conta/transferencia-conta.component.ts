import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Conta } from 'src/app/shared/models/conta';
import { Transferencia } from 'src/app/shared/models/transferencia';
import { ClienteService } from 'src/app/shared/services/cliente/cliente.service';
import { ContaService } from 'src/app/shared/services/conta/conta.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-transferencia-conta',
  templateUrl: './transferencia-conta.component.html',
  styleUrls: ['./transferencia-conta.component.scss']
})
export class TransferenciaContaComponent {
  formGroup: FormGroup;
  contas: Conta[]


  constructor(private contaService: ContaService, private router: Router, private clienteService: ClienteService){


    this.formGroup = new FormGroup({
      valor: new FormControl('', Validators.required),
      conta_destino: new FormControl('', Validators.required),
      conta_origem: new FormControl('', Validators.required)
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
    const tranferencia: Transferencia = this.formGroup.value;
      this.contaService.tranferencia(tranferencia).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Sucesso',
            text: 'Transferência registrada com sucesso!',
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
            text: 'Erro ao registrar transferência!',
          });
        }
      });
    }
}


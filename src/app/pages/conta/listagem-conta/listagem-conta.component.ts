import { Component, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Conta } from 'src/app/shared/models/conta';
import { ClienteService } from 'src/app/shared/services/cliente/cliente.service';
import { ContaService } from 'src/app/shared/services/conta/conta.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listagem-conta',
  templateUrl: './listagem-conta.component.html',
  styleUrls: ['./listagem-conta.component.scss']
})
export class ListagemContaComponent {
  displayedColumns: string[] = ['id', 'numero', 'agencia', 'saldo', 'cliente', 'funcoes'];
  dataSource = new MatTableDataSource<Conta>;
 
  @ViewChild(MatPaginator) paginator!: MatPaginator;


  constructor(private contaService: ContaService, private clienteService: ClienteService){
  }


  ngAfterViewInit() {
    this.listarContas(1, 5)
  }


  listarContas(page: number, pageSize: number) {
    this.contaService.listar_paginado(page, pageSize).subscribe(contas => {
      this.clienteService.listar().subscribe(clientes => {
        const contasComNomesDeClientes = contas.map(conta => {
          const cliente = clientes.find(cliente => cliente.id === conta.cliente);
          if (cliente) {
            conta.nomeCliente = cliente.nome;
          }
          return conta;
        });
        this.dataSource.data = contasComNomesDeClientes;
      });
    });
  }




  onPageChange(event: PageEvent) {
    const pageIndex = event.pageIndex + 1;
    const pageSize = event.pageSize;
    this.listarContas(pageIndex, pageSize);
  }


  deletarCLiente(id: number){
    Swal.fire({
      title: 'Você tem certeza que deseja deletar?',
      text: "Não tem como reverter essa ação",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'red',
      cancelButtonColor: 'grey',
      confirmButtonText: 'Deletar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.contaService.deletar(id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Sucesso',
              text: 'Conta deletada com sucesso!',
              showConfirmButton: false,
              timer: 1500
            })
            this.listarContas(1,5)
          },
          error: (error) => {
            console.error(error)
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Erro ao deletar conta!',
            })
          }})
      }})}
}


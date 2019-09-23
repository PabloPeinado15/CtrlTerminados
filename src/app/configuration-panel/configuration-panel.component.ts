import { Component, OnInit } from '@angular/core';
import { UploadFile, UploadEvent, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { Papa, PapaParseConfig, PapaParseResult, PapaUnparseConfig } from 'ngx-papaparse';
import { IClient } from '../shared/models/client.model';
import { HttpClientModule } from '@angular/common/http';
import { HttpService } from '../shared/services/client.http.service';
import * as fileSaver from 'file-saver';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-configuration-panel',
  templateUrl: './configuration-panel.component.html',
  styleUrls: ['./configuration-panel.component.css']
})
export class ConfigurationPanelComponent implements OnInit {

  private optionsCSV: PapaParseConfig;
  private optionsUnparseCSV: PapaUnparseConfig;
  public files: UploadFile[] = [];
  public totalClients: IClient[];
  public clientsFiltered: IClient[];
  displayedColumns = ['name', 'email', 'tlf'];
  dataSource = [];

  ngOnInit() {

    this.clientsFiltered = [];

    this.optionsUnparseCSV = {
      header: true
    };

    this.optionsCSV = {
      complete: (results: PapaParseResult, file) => {
        this.totalClients = results.data;
        this.clientsFiltered = [];

        this.httpService.getAllClients().subscribe((res: any) => {
          if (res.responseSuccess) {
            this.totalClients.forEach(client => {
              const index = res.responseDesc.findIndex(val => val.email === client.email || val.tlf === client.tlf);
              if (index === -1) {
                this.clientsFiltered.push(client);
              }
            });
            this.dataSource = this.clientsFiltered;
            this.snackbar.open('Ningún cliente nuevo a insertar.', '', {duration: 2500});
          }
        });
      },
      header: true,
    };
  }

  public getClientsCSV() {
    this.httpService.getAllClients().subscribe((res: any) => {
      if (res.responseSuccess) {
        const data = res.responseDesc.map(client => {
          return {
            name: client.name,
            email: client.email,
            tlf: client.tlf
          };
        });
        const csv = this.papa.unparse(data, this.optionsUnparseCSV);
        const blob = new Blob([csv], {type: 'text/plain; charset=utf-8'});
        fileSaver.saveAs(blob, 'clientes.csv');
      }
    });
  }

  public insertClientsFromCSV() {
    if (this.clientsFiltered && this.clientsFiltered.length) {
      this.httpService.addNewClients(this.clientsFiltered).subscribe(res => {
        if (res.responseSuccess) {
          const inserted = res.responseDesc.generated_keys.length;
          this.clientsFiltered = [];
          this.dataSource = this.clientsFiltered;
          console.log(res.responseDesc);
          const snackbarMessage = inserted > 1 ? 'Añadidos ' + inserted + ' nuevos clientes.' : 'Añadido ' + inserted + ' nuevo cliente.';
          this.snackbar.open(snackbarMessage, '', {duration: 2500});
        }
      });
    }
  }

  public dropped(event: UploadEvent) {
    this.files = event.files;
    for (const droppedFile of event.files) {

      // Is it a file?
      if (droppedFile.fileEntry.isFile && droppedFile.fileEntry.name.endsWith('.csv')) {

        console.log();

        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {

          this.papa.parse(file, this.optionsCSV);

        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }

  public fileOver(event) {
    console.log(event);
  }

  public fileLeave(event) {
    console.log(event);
  }

  getTotalClients (): number {
    return this.clientsFiltered ? this.clientsFiltered.length : 0;
  }

  constructor(private papa: Papa, private httpService: HttpService, private snackbar: MatSnackBar) { }

}

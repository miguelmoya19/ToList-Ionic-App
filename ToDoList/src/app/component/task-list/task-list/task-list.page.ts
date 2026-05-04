import { CommonModule } from '@angular/common';
import { Component, EventEmitter, input, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonList, IonItem, IonLabel, IonButton, IonIcon,
  IonItemSliding, IonItemOptions, IonItemOption,
  IonCard, IonCardContent, IonBadge, IonModal
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  trashOutline, calendarOutline, checkmarkDoneCircleOutline
} from 'ionicons/icons';
import { TaskModelDTO } from 'src/app/model/dto/ItaskDTO';
import { LoadingSkeletonComponent } from '../../loading/loading-skeleton/loading-skeleton.component';
import { DatabaseServiceCategory } from 'src/app/services/dbCategory/database.service';
import { ICategoryDTO } from 'src/app/model/dto/IcategoryDTO';
import { TaskFormModalComponent } from '../../task-form-modal/task-form-modal.component';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.page.html',
  styleUrls: ['./task-list.page.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [
    IonList, IonItem, IonLabel, IonButton,
    IonIcon, IonItemSliding, IonItemOptions, IonItemOption,
    IonCard, IonCardContent, IonBadge, IonModal,
    RouterLink, CommonModule, LoadingSkeletonComponent,
    TaskFormModalComponent
  ],
})
export class TaskListPage{

  @Input() taskInformation: TaskModelDTO[] = [];
  @Input() taskInformationCopy: TaskModelDTO[] = [];
  @Input() informationCategory: Partial<ICategoryDTO>[] = [];
  @Input() isLoading: boolean = true;
  @Output() addTask = new EventEmitter<{ id: string, complete: boolean }>();
  @Output() deleteTask = new EventEmitter<string>();
  @Output() assignedId = new EventEmitter<Partial<ICategoryDTO>>();

  @ViewChild('editModal') editModal!: IonModal;

  

  public selectedCategoryId: string | null = null;
  public selectedTask: TaskModelDTO | undefined;

  constructor(private databaseCategory: DatabaseServiceCategory) {
    addIcons({
      trashOutline, calendarOutline, checkmarkDoneCircleOutline
    });
  
  }

  ionViewWillEnter(){
    console.log("Holisss");
  }

  private async loadAllCategories() {
    this.informationCategory = await this.databaseCategory.getCategory();
  }

  public openEditModal(task: TaskModelDTO): void {
    this.selectedTask = task;
    this.editModal.present();
  }

  public deleteAsyncTask(id: string) {
    if (id === null || id === '') throw new Error('no se encontró el id la tarea.');
    this.deleteTask.emit(id);
  }

  public assignedCategory(event: Partial<ICategoryDTO>): void {
    this.assignedId.emit(event);
  }

  public  filterInformationForCategory(id: string | undefined | null) {
    this.selectedCategoryId = id || null;
    let filterData = [...this.taskInformationCopy];

    if (!id) {
      this.taskInformation = filterData;
      return;
    }

   
    this.taskInformation = filterData.filter(s => s.id_category === id);
  }
}

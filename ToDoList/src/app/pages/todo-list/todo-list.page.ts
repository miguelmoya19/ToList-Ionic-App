import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonLabel, IonCheckbox, IonButton, IonIcon,
  IonInput, IonItemSliding, IonItemOptions, IonItemOption,
  IonSelect, IonSelectOption, IonCard, IonCardContent,
  IonFab, IonFabButton, IonModal, IonButtons
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  trashOutline, add, checkmarkCircle, ellipseOutline,
  listOutline, createOutline, checkmark, documentTextOutline,
  addCircleOutline, gridOutline, checkmarkDoneCircle,
  timeOutline, checkmarkCircleOutline
} from 'ionicons/icons';
import { BehaviorSubject, debounceTime, Subject, takeUntil, tap } from 'rxjs';
import { TaskModelDTO } from 'src/app/model/dto/ItaskDTO';
import { DatabaseServiceTask } from 'src/app/services/dbTask/database.service';
import { TaskListPage } from "src/app/component/task-list/task-list/task-list.page";
import { LoggerService } from 'src/app/services/logger/logger.service';
import { ActionCrudToDoList } from 'src/app/services/ToDoList-actions/action-crud-to-do-list';
import { ICategoryDTO } from 'src/app/model/dto/IcategoryDTO';
import { ITaskStorageDTO } from 'src/app/model/dto/ITaskStorageDto';
import { Feature } from "src/app/directive/feature";
import { TaskFormModalComponent } from 'src/app/component/task-form-modal/task-form-modal.component';
import { CategoryListComponent } from 'src/app/component/category-list/category-list.component';
import { DashTotal } from 'src/app/model/dashTotalModel';
import { DatabaseServiceCategory } from 'src/app/services/dbCategory/database.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: 'todo-list.page.html',
  styleUrls: ['todo-list.page.scss'],
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonList, IonItem, IonLabel, IonCheckbox, IonButton,
    IonIcon, IonInput, IonItemSliding, IonItemOptions, IonItemOption,
    IonSelect, IonSelectOption, IonCard, IonCardContent,
    IonFab, IonFabButton, IonModal, IonButtons,
    RouterLink, ReactiveFormsModule, CommonModule,
    TaskListPage, Feature, TaskFormModalComponent, CategoryListComponent
  ],
})
export class TodoListPage {

  public taskInformation: TaskModelDTO[] = [];
  public taskCategory: Partial<ICategoryDTO>[]  = [];
  public taskInformationComplete: TaskModelDTO[] = [];
  public taskDataCopy: TaskModelDTO[] = [];
  public isLoading = this.crudTask.isLoading;
  private destroy$ = new Subject<void>();
  public isAllTask: boolean = true;
  public formTask: FormGroup;
  public informationProgress = signal<{ total: number, totalSuccess: number,porcentage:number }>({
    total: 0,
    totalSuccess: 0,
    porcentage:0
  });

  constructor(
    private readonly database: DatabaseServiceTask,
    private readonly fb: FormBuilder,
    private readonly logger: LoggerService,
    private readonly crudTask: ActionCrudToDoList,
    private readonly databaseCategory: DatabaseServiceCategory
  ) {
    addIcons({
      trashOutline, add, checkmarkCircle, ellipseOutline,
      listOutline, createOutline, checkmark, documentTextOutline,
      addCircleOutline, gridOutline, checkmarkDoneCircle,
      timeOutline, checkmarkCircleOutline
    });

    this.formTask = this.fb.group({
      id: [null],
      title: ['', Validators.required],
      description: ['']
    });
  }

  get getTask(): Promise<TaskModelDTO[]> {
    return this.database.getTasks();
  }

  ionViewWillEnter(): void {
    this.listeningTask();
    this.loadInformationInit();
  }

  ionViewWillLeave() {
    this.destroy$.next();
  }

  public listeningTask(): void {
    this.database.storageListening()
      .pipe(
        takeUntil(this.destroy$),
        tap(() => this.crudTask.loadingUpdate(true)),
        debounceTime(1700)
      )
      .subscribe({
        next: async (res) => {
          this.crudTask.updateVersionTask(res as Partial<ITaskStorageDTO>);
          this.loadInformationInit();
          this.crudTask.loadingUpdate(false);
        },
        error: (err) => {
          this.logger.error("", `${err}`);
        }
      });
  }

  private async loadInformationInit() {
    const versionTaskCache = this.crudTask.getVersionTask();
    const versionStorage = await this.database.getVersionDB();

    if (versionTaskCache !== versionStorage) {
      this.taskInformation = await this.database.getTasks();
      this.taskDataCopy = [...this.taskInformation];
      this.crudTask.updateVersionTask({ data: this.taskInformation });

      const version = this.crudTask.getVersionTask();
      await this.database.systemVersion(version);
    } else {
      this.taskInformation = this.crudTask.dataInitialObservableVersion();
      this.taskDataCopy = [...this.taskInformation];
    }

    this.crudTask.timeSkeleton();

    this.informationProgress.set({
      total: this.taskInformation.length,
      totalSuccess: this.taskInformation.filter(s => s.is_completed).length,
      porcentage: this.taskInformation.length > 0
        ? ((this.taskInformation.filter(s => s.is_completed).length) / this.taskInformation.length) * 100
        : 0
    });
    this.taskCategory = await this.databaseCategory.getCategory();
  }

  public async onModalDismiss(event: any): Promise<void> {
    if (event.detail.data?.taskAdded || event.detail.data?.taskUpdated) {
      await this.loadInformationInit();
    }
  }

  public updateAsyncTask(event: { id: string, complete: boolean }): void {
    this.crudTask.updateTask(event);
  }

  public async assignedIdToCategory(event: Partial<ICategoryDTO & { idTask: string }>) {
    this.crudTask.assignedCategory(event);
  }

  public viewInformationComplete(): void {
    const data = [...this.taskInformation].filter(s => s.is_completed == true);
    this.taskInformationComplete = data;
    this.taskDataCopy = [...data];
    this.isAllTask = false;
  }

  public viewAll() {
    this.isAllTask = true;
  }

  public async deleteAsyncTask(event: string) {
    this.crudTask.deleteTask(event);
  }
}

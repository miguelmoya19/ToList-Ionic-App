import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
  IonContent, IonLabel, IonItem, IonInput, IonSelect, IonSelectOption,
  IonToggle, IonFooter, ModalController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeCircle, folderOutline } from 'ionicons/icons';
import { DatabaseServiceTask } from 'src/app/services/dbTask/database.service';
import { DatabaseServiceCategory } from 'src/app/services/dbCategory/database.service';
import { ActionCrudToDoList } from 'src/app/services/ToDoList-actions/action-crud-to-do-list';
import { AlertService } from 'src/app/services/alert/alert.service';
import { TaskModelDTO } from 'src/app/model/dto/ItaskDTO';
import { ICategoryDTO } from 'src/app/model/dto/IcategoryDTO';
import { taskModel } from 'src/app/model/taskModel';

@Component({
  selector: 'app-task-form-modal',
  templateUrl: './task-form-modal.component.html',
  styleUrls: ['./task-form-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
    IonContent, IonLabel, IonItem, IonInput, IonSelect, IonSelectOption,
    IonToggle, IonFooter
  ]
})
export class TaskFormModalComponent implements OnInit {

  @Input() task?: TaskModelDTO;
  @Input() isEdit = false;

  public taskForm!: FormGroup;
  public categories: Partial<ICategoryDTO>[] = [];

  constructor(
    private readonly modalCtrl: ModalController,
    private readonly fb: FormBuilder,
    private readonly database: DatabaseServiceTask,
    private readonly dbCategory: DatabaseServiceCategory,
    private readonly crudTask: ActionCrudToDoList,
    private readonly alert: AlertService
  ) {
    addIcons({ closeCircle, folderOutline });

    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      id_category: [null],
      is_completed: [false]
    });
  }

  async ngOnInit(): Promise<void> {
    await this.loadCategories();

    if (this.task && this.isEdit) {
      this.taskForm.patchValue({
        title: this.task.title,
        id_category: this.task.id_category,
        is_completed: this.task.is_completed
      });
    }
  }

  public dismiss(): void {
    this.modalCtrl.dismiss();
  }

  public async saveTask(): Promise<void> {
    if (this.taskForm.invalid) {
      this.alert.error('Error', 'El título es obligatorio.');
      return;
    }

    const { title, description, id_category, is_completed } = this.taskForm.value;

    try {
      if (this.isEdit && this.task) {
        const updatedTask: TaskModelDTO = {
          ...this.task,
          title: title.trim(),
          description: description || null,
          id_category: id_category || null,
          name_category: this.categories.find(c => c.id === id_category)?.name ?? this.task.name_category,
          is_completed: is_completed
        };
        await this.database.updateTaskAssigned(
          updatedTask.id,
          updatedTask.id_category ?? '',
          updatedTask.name_category ?? '',
          updatedTask.is_completed ?? false

        );
        this.alert.success('Éxito', 'Tarea actualizada correctamente.', 1500);
        this.modalCtrl.dismiss({ taskUpdated: true });
      } else {
        // Insert new task
        const validatorUniqueTask = (await this.database.getTasks())
          .some(s => s.title.trim().toLowerCase() === title.trim().toLowerCase());

        if (validatorUniqueTask) {
          this.alert.error('Error', 'Ya existe una tarea con ese título.');
          return;
        }

        const built = new taskModel()
          .setTitle(title.trim())
          .setDescription(description || '')
          .build();

        const newTask: TaskModelDTO = {
          id: built.id,
          title: built.title,
          description: built.description,
          is_completed: false,
          is_delete: built.is_delete,
          created_at: built.created_at,
          id_category: id_category || null,
          name_category: id_category
            ? (this.categories.find(c => c.id === id_category)?.name ?? null)
            : null
        };

        await this.database.insertTask(newTask);
        this.alert.success('Éxito', 'Tarea creada correctamente.', 1500);
        this.modalCtrl.dismiss({ taskAdded: true });
      }
    } catch (err) {
      this.alert.error('Error', `${err}`);
    }
  }

  private async loadCategories(): Promise<void> {
    this.categories = await this.dbCategory.getCategory();
  }
}

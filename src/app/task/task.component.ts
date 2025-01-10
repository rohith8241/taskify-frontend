import { Component, inject } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import { AddTaskComponent } from '../add-task/add-task.component';
import { AppService } from '../../services/app.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss'
})
export class TaskComponent {
  editTask: boolean = false;
  filter: boolean = false;
  taskId: any;
isloading: boolean = false;

tasks: any[] = [];

 addTaskForm = new FormGroup({
    title: new FormControl(''),
    description: new FormControl(''),
    dueDate: new FormControl(new Date(), { validators: [Validators.required] }),
    priority: new FormControl(1, { validators: [Validators.min(1), Validators.max(4)] }),
    status: new FormControl('pending', { validators: [Validators.required] })
  })

constructor(
  private dialog: MatDialog,
  private app: AppService,
  private toastr: ToastrService
){
}

ngOnInit(){
  this.getTasks()
  }

  async getTasks(){ 
    await this.app.send('getTasks', {}).then(res => {
    this.tasks = res.body
  })
}

  async onSubmit(){
        if(this.editTask){
          this.isloading = true;
          console.log("updateTask dued", this.taskId);
          let updatedTask = {
            ...this.addTaskForm.value,
            id: this.taskId
          }
          console.log("updatedTask", updatedTask)
          let res = await this.app.send('updateTask', updatedTask)
          console.log("res in updateTask", res)
          if(res?.body.updated){
            await this.getTasks();
            this.toastr.success('Task updated successfully');
            this.isloading = false;
            this.editTask = false;
          }
          //   this.editTask = false;
          // }
        }else{
        this.isloading = true;
      let res = await this.app.send('createTask', this.addTaskForm.value)
      if(res?.body.created){
        this.addTaskForm.reset();
        await this.getTasks();
        this.toastr.success('Task created successfully');
        this.isloading = false;
      }
    }
 }

 getTasksCount(type: string): number {
  return this.tasks.filter(task => task.status === type).length;
}
  async openExistingTask(taskId: number){
    this.editTask = true;
    this.taskId = taskId;
    console.log("taskId", taskId)
   let res = await this.app.send('getTasks', {id:taskId})
  //  console.log("res", res)
  // res.body.due_date = this.convertToDate(res.body.due_date);
   this.addTaskForm.patchValue({
     title: res.body.title,
     description: res.body.description,
     dueDate: this.convertToDate(res.body.due_date),
     priority: res.body.priority,
     status: res.body.status
   });
  }


  convertToDate(date: string): Date {
    return new Date(date);
  }

  addTask(){
    this.editTask = false;
    this.addTaskForm.reset();
  }

  async deleteTask(taskId: number){
    console.log("taskId", taskId)
    let res = await this.app.send('deleteTask', {id:taskId})
    console.log("res in deleteTask", res)
    await this.getTasks();
    this.toastr.success('Task deleted successfully');
    this.isloading = false;
  }

  filterByPriority(){
    if(this.filter){
      this.filter = false;
      this.tasks = this.tasks.sort((a, b) => a.priority - b.priority);
    }else{
      this.filter = true;
      this.tasks = this.tasks.sort((a, b) => b.priority - a.priority);
    }
  }

}

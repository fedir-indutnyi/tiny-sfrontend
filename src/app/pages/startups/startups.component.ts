import {Component, OnInit} from '@angular/core';
//import {CrudService} from "../../crud.service";
import {IdeastartuplistControllerService} from '../../shared/sdk';

@Component({
  selector: 'startups',
  templateUrl: 'startups.component.html'
})
export class StartupsComponent implements OnInit{

  list = [];
  comments: any = '';
  ideas: any = '';
  id: any;

  constructor(
    //private crud: CrudService,
    private service: IdeastartuplistControllerService,
  ) {

  }

  ngOnInit() {
    this.service.ideastartuplistControllerFind(
      JSON.stringify({
        // include: ['userprofile'],
        order: 'id DESC',
        limit: 1000,
        skip: 0,
        where: {
          or: [{visibleglobally: 1}, {visibleglobally: true}]
        }
      }) as any
      ).subscribe(resp => {
      this.list = resp;
    });

    // this.crud.readIdea().subscribe(data => {this.ideas = data });
    // this.crud.readComment().subscribe(data => {this.id = data });
  }

  // getInfo() {
  //   this.crud.readComment().subscribe(data => {
  //     this.comments = data;
  //     this.id = data;
  //   });
  // }

  createInfo(ideaid, commenttext) {
    let str ={
    "commenttext": commenttext,
    "ideaid": parseInt(ideaid[0].children[0].textContent),
    "userprofileId": 5,
    "commentdatetime": "2018-12-07T19:45:57.107Z",
    "feedbackrank": 0,
    //"id": this.id[this.id.length-1].id+1
    };

    // this.crud.createComment(str).subscribe(data => {})
  }

  // deleteInfo(id) {
  //   // this.crud.deleteComment(id).subscribe(data => {this.getInfo();})
  // }

  // updateInfo(str){
  //   debugger;
  //   // this.crud.updateComment(str).subscribe(data => {})
  // }
}

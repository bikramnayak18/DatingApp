import { ToastrService } from 'ngx-toastr';
import { MembersService } from './../../_services/members.service';
import { AccountService } from './../../_services/account.service';
import { User } from './../../_models/User';
import { Member } from './../../_models/Member';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { take } from 'rxjs/operators';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  member : Member;
  user : User;
  @ViewChild('editForm') editFrom: NgForm;
  @HostListener('window:beforeunload', ['$event']) unloadNotification($event:any){
    if(this.editFrom.dirty)
      $event.returnValue = true;
  }
  constructor(private accountService:AccountService, private memberService:MembersService,
    private toastr:ToastrService) { 
    accountService.currentUser$.pipe(take(1)).subscribe(curr => this.user = curr);
  }

  ngOnInit(): void {
    this.loadMember();
  }

  loadMember(){
    this.memberService.getMember(this.user.username).subscribe( member =>{
      this.member = member;
    })
  }

  updateMember(){
    this.memberService.udpateMember(this.member).subscribe(() =>{
      this.toastr.success("Profile updated");
      this.editFrom.reset(this.member);
    })
    
  }
}

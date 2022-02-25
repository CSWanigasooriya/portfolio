import { Component, HostListener, OnInit } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-final',
  templateUrl: './final.component.html',
  styleUrls: ['./final.component.scss'],
})
export class FinalComponent implements OnInit {
  // @HostListener('scroll', ['$event']) // for scroll events of the current element
  @HostListener('window:scroll', ['$event']) // for window scroll events
  onScroll(event: any) {
    var $el = $('.toc-wrapper');
    var isPositionFixed = $el.css('position') == 'fixed';
    if (event.scrollTop() > 500 && !isPositionFixed) {
      $el.css({ position: 'fixed', top: '0px' });
    }
    if (event.scrollTop() < 500 && isPositionFixed) {
      $el.css({ position: 'static', top: '0px' });
    }
  }

  ngOnInit(): void {
    $('.tap-target').tapTarget();
    $('.collapsible').collapsible();
    $('.sidenav').sidenav();
    $('.scrollspy').scrollSpy();
    $('.fixed-action-btn').floatingActionButton();
    $('.parallax').parallax();
    $('.tabs').tabs();

    //  check if runOnce exists, if not run the block.
    if (!localStorage.getItem('runOnce')) {
      //  we set the runOnce, so this block doesn't run on the second time.
      localStorage.setItem('runOnce', '1');
      $('.tap-target').tapTarget('open');
    } else {
      $('.tap-target').tapTarget('close');
    }

    if ($(window).width() < 992) {
      // change functionality for smaller screens
    } else {
      // change functionality for larger screens
    }
  }

  printContent(id: string) {
    let printContents = document.getElementById(id)!.innerHTML;
    let originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;

    window.print();

    document.body.innerHTML = originalContents;
  }
}

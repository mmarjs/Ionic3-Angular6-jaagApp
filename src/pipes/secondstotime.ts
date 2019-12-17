import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'secondsTotime'})
export class SecondsTotime implements PipeTransform {
  times = {
    hour: 3600,
    minute: 60,
    second: 1
  }
  transform(value: string): string {
    let seconds = parseInt(value);
    let time_string: string = '';
    if (seconds === 0){
      time_string = '00'
    }
    let plural: string = '';
    for(var key in this.times){
      if(Math.floor(seconds / this.times[key]) > 0){
        let num = Math.floor(seconds / this.times[key]).toString();
        if (this.times[key] === 1){
          plural = '';
          if (num.length === 1) {
            num = '0' + num;
          }
        } else {
          plural = ':';
        }
        time_string += num + plural ;
        seconds = seconds - this.times[key] * Math.floor(seconds / this.times[key]);
      } else if (parseInt(value) === 60 && seconds === 0) {
        time_string = time_string + '00';
      }
    }
    if (parseInt(value) < 60){
      time_string = '0:' + time_string;
    }
    return time_string;
  }
}
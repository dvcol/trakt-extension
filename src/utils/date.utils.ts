export class DateUtils {
  static clone = (date: Date) => new Date(date);

  static next(days = 1, date?: Date, coefficient = 1) {
    const _date = date ? this.clone(date) : new Date();
    _date.setDate(_date.getDate() + days * coefficient);
    return _date;
  }

  static previous(days = 1, date?: Date, coefficient = 1) {
    return this.next(days, date, -coefficient);
  }

  static weeks = {
    previous: (weeks = 1, date?: Date) => this.previous(weeks, date, 7),
    next: (weeks = 1, date?: Date) => this.next(weeks, date, 7),
  };
}

void main() {
    long digits = Long.parseLong(IO.readln().trim());
    long value = 0;
    long place = 1;
    while (digits > 0) {
        value += (digits % 10) * place;
        place *= 2;
        digits /= 10;
    }
    IO.println(value);
}

void main() {
    int count = 0;
    int sum = 0;
    int number;
    do {
        number = Integer.parseInt(IO.readln().trim());
        if (number != 0) {
            count++;
            sum += number;
        }
    } while (number != 0);
    IO.println("Count: " + count);
    IO.println("Sum: " + sum);
}

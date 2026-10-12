void main() {
    int n = Integer.parseInt(IO.readln().trim());
    int three = 0;
    int five = 0;
    for (int i = 1; i <= n; i++) {
        three++;
        five++;
        if (three == 3 && five == 5) {
            IO.println("FizzBuzz");
            three = 0;
            five = 0;
        } else if (three == 3) {
            IO.println("Fizz");
            three = 0;
        } else if (five == 5) {
            IO.println("Buzz");
            five = 0;
        } else {
            IO.println(i);
        }
    }
}

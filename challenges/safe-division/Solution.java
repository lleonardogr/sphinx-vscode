void main() {
    int t = Integer.parseInt(IO.readln().trim());
    for (int i = 0; i < t; i++) {
        String[] p = IO.readln().trim().split(" ");
        int a = Integer.parseInt(p[0]);
        int b = Integer.parseInt(p[1]);
        try {
            IO.println(a + " / " + b + " = " + a / b);
        } catch (ArithmeticException e) {
            IO.println("Cannot divide by zero");
        }
    }
}

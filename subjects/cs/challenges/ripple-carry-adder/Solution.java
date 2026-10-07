void main() {
    String a = IO.readln().trim();
    String b = IO.readln().trim();
    String sum = "";
    String carries = "";
    int carry = 0;
    for (int i = 7; i >= 0; i--) {
        int x = a.charAt(i) - '0';
        int y = b.charAt(i) - '0';
        int s = x ^ y ^ carry;
        carry = (x & y) | (carry & (x ^ y));
        sum = s + sum;
        carries = carry + carries;
    }
    IO.println("Sum: " + sum);
    IO.println("Carries: " + carries);
    IO.println("Carry out: " + carry);
}

void main() {
    int n = Integer.parseInt(IO.readln().trim());
    String[] parts = IO.readln().trim().split(" +");
    Set<Integer> days = new HashSet<>();
    for (int i = 0; i < n; i++) {
        days.add(Integer.parseInt(parts[i]));
    }
    int longest = 0;
    int start = 0;
    for (int day : days) {
        if (!days.contains(day - 1)) {
            int end = day;
            while (days.contains(end + 1)) {
                end++;
            }
            int length = end - day + 1;
            if (length > longest || (length == longest && day < start)) {
                longest = length;
                start = day;
            }
        }
    }
    IO.println("longest streak: " + longest);
    IO.println("starts on day: " + start);
}

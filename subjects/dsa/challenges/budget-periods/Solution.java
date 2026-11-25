void main() {
    String[] first = IO.readln().trim().split(" +");
    int n = Integer.parseInt(first[0]);
    long k = Long.parseLong(first[1]);
    String[] parts = IO.readln().trim().split(" +");
    Map<Long, Integer> seen = new HashMap<>();   // prefix total -> how many times so far
    Map<Long, Integer> firstDay = new HashMap<>(); // prefix total -> the first day it appeared
    seen.put(0L, 1);
    firstDay.put(0L, 0);
    long total = 0;
    long periods = 0;
    int longest = 0;
    for (int day = 1; day <= n; day++) {
        total += Integer.parseInt(parts[day - 1]);
        periods += seen.getOrDefault(total - k, 0);
        Integer start = firstDay.get(total - k);
        if (start != null) {
            longest = Math.max(longest, day - start);
        }
        seen.merge(total, 1, Integer::sum);
        firstDay.putIfAbsent(total, day);
    }
    IO.println("periods: " + periods);
    IO.println("longest: " + longest);
}

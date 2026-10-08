Map<String, String> aliases = new HashMap<>();
Map<String, List<String>> addresses = new HashMap<>();

String resolve(String name) {
    List<String> visited = new ArrayList<>();
    while (true) {
        if (visited.contains(name)) {
            visited.add(name);
            return String.join(" -> ", visited) + " -> LOOP";
        }
        visited.add(name);
        if (addresses.containsKey(name)) {
            return String.join(" -> ", visited) + " -> " + String.join(", ", addresses.get(name));
        }
        if (!aliases.containsKey(name)) {
            return String.join(" -> ", visited) + " -> NXDOMAIN";
        }
        name = aliases.get(name);
    }
}

void main() {
    int r = Integer.parseInt(IO.readln().trim());
    for (int i = 0; i < r; i++) {
        String[] record = IO.readln().trim().split("\\s+");
        String name = record[0].toLowerCase();
        if (record[1].equals("CNAME")) {
            aliases.put(name, record[2].toLowerCase());
        } else {
            addresses.computeIfAbsent(name, key -> new ArrayList<>()).add(record[2]);
        }
    }
    int q = Integer.parseInt(IO.readln().trim());
    for (int i = 0; i < q; i++) {
        IO.println(resolve(IO.readln().trim().toLowerCase()));
    }
}

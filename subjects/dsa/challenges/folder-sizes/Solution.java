class Folder {
    final Map<String, Folder> children = new HashMap<>();
    long ownFiles = 0;
}

long limit;
int folders = 0;
int overLimit = 0;
String largestPath = null;
long largestSize = 0;

/** Post-order: adds up the subfolders first, then counts this folder (the root has a null path). */
long total(Folder folder, String path) {
    long sum = folder.ownFiles;
    for (var e : folder.children.entrySet()) {
        sum += total(e.getValue(), path == null ? e.getKey() : path + "/" + e.getKey());
    }
    if (path != null) {
        folders++;
        if (sum >= limit) {
            overLimit++;
        }
        if (sum > largestSize || (sum == largestSize && path.compareTo(largestPath) < 0)) {
            largestSize = sum;
            largestPath = path;
        }
    }
    return sum;
}

void main() {
    String[] first = IO.readln().trim().split(" +");
    int n = Integer.parseInt(first[0]);
    limit = Long.parseLong(first[1]);
    Folder root = new Folder();
    for (int i = 0; i < n; i++) {
        String[] parts = IO.readln().trim().split(" +");
        String[] names = parts[0].split("/");
        Folder folder = root;
        for (int k = 0; k < names.length - 1; k++) {
            folder = folder.children.computeIfAbsent(names[k], name -> new Folder());
        }
        folder.ownFiles += Long.parseLong(parts[1]);
    }
    long all = total(root, null);
    IO.println("folders: " + folders);
    IO.println("total size: " + all);
    IO.println("folders over limit: " + overLimit);
    IO.println("largest folder: " + (largestPath == null ? "none" : largestPath));
    IO.println("largest folder size: " + largestSize);
}

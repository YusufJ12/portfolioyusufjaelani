export default function Overview() {
    return (
      <main className="flex-1 p-6 overflow-y-auto">
        <h2 className="text-2xl font-semibold text-[#101010] dark:text-[#94A9C9] mb-4">
          Dashboard Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 bg-white dark:bg-[#222F43] rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">📈 Statistik</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Belum ada data.</p>
          </div>
          <div className="p-6 bg-white dark:bg-[#222F43] rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">🛠️ Pengaturan</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Edit preferensi admin.</p>
          </div>
          <div className="p-6 bg-white dark:bg-[#222F43] rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">📝 Artikel</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Tambahkan postingan baru.</p>
          </div>
        </div>
      </main>
    );
  }
  
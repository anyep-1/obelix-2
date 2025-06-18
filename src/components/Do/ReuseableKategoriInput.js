const ReusableKategoriInput = ({ kategori, onChange }) => {
  return (
    <div>
      <h3 className="text-lg font-bold mt-6 mb-2">
        Klasifikasi Pengukuran Luaran
      </h3>

      {kategori.map((item, index) => (
        <div
          key={item.level}
          className="border border-gray-200 p-4 rounded-lg shadow-sm mb-4 bg-white"
        >
          <h4 className="font-bold text-lg mb-3">{item.level}</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nilai */}
            <div>
              <label
                htmlFor={`nilai-${index}`}
                className="block mb-1 font-medium text-sm"
              >
                Nilai
              </label>
              <input
                id={`nilai-${index}`}
                type="number"
                value={item.nilai}
                onChange={(e) => onChange(index, "nilai", e.target.value)}
                required
                className="w-full p-2 border rounded"
              />
            </div>

            {/* Min - Max */}
            <div>
              <label
                htmlFor={`range-${index}`}
                className="block mb-1 font-medium text-sm"
              >
                Range Nilai (Min - Max)
              </label>
              <div className="flex gap-2">
                <input
                  id={`min-${index}`}
                  type="number"
                  value={item.min}
                  onChange={(e) => onChange(index, "min", e.target.value)}
                  required
                  placeholder="Min"
                  className="w-full p-2 border rounded"
                />
                <input
                  id={`max-${index}`}
                  type="number"
                  value={item.max}
                  onChange={(e) => onChange(index, "max", e.target.value)}
                  required
                  placeholder="Max"
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>

          {/* Deskripsi */}
          <div className="mt-4">
            <label
              htmlFor={`deskripsi-${index}`}
              className="block mb-1 font-medium text-sm"
            >
              Deskripsi
            </label>
            <textarea
              id={`deskripsi-${index}`}
              value={item.deskripsi}
              onChange={(e) => onChange(index, "deskripsi", e.target.value)}
              required
              rows={3}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReusableKategoriInput;

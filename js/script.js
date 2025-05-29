$(document).ready(function() {
    let isPlaying = false;
    let allFetchedGames = []; // <-- 1. VARIABEL BARU UNTUK MENYIMPAN SEMUA GAME

    // Function to show/hide loading screen
    function toggleLoadingScreen(show) {
        if (show) {
            $('#loading-screen').fadeIn(300);
        } else {
            $('#loading-screen').fadeOut(300);
        }
    }

    // Hide loading screen initially
    toggleLoadingScreen(false);

    // Fungsi displayError ...
    function displayError(message, isFatal = false) {
        const errorHtml = `
            <div class="no-games-message">
                <p>${message === 'No games found. Please try a different search term.' ? 'No games found :(' : message}</p>
                ${!isFatal ? '<button class="btn btn-navy mt-3" onclick="location.reload()">Back</button>' : ''}
            </div>
        `;
        $('#games-list-body').html(`
            <tr>
                <td colspan="9" class="text-center">
                    ${errorHtml}
                </td>
            </tr>
        `);
        $('#custom-table-scrollbar').removeClass('visible'); // <-- PASTIKAN SCROLLBAR HILANG
    }

    // Fungsi displayGames ...
    function displayGames(games) {
        const gamesListBody = $('#games-list-body');
        gamesListBody.empty();

        try {
            if (games.length === 0) {
                 // Jika tidak ada game (setelah filter), tampilkan pesan khusus
                 // tapi jangan panggil displayError agar tidak tumpuk
                 $('#games-list-body').html(`
                    <tr>
                        <td colspan="9" class="text-center">
                           <div class="no-games-message">
                               <p>No games match your current filter.</p>
                           </div>
                        </td>
                    </tr>`);
            } else {
                games.forEach(game => {
                    const gameRow = `
                        <tr>
                            <td>${game.storeName || 'Unknown Store'}</td>
                            <td>${Math.round(parseFloat(game.savings || 0))}%</td>
                            <td>$${parseFloat(game.salePrice || 0).toFixed(2)} <small class="price-original">$${parseFloat(game.normalPrice || 0).toFixed(2)}</small></td>
                            <td><img src="${game.thumb || 'https://via.placeholder.com/80x100/6c757d/FFFFFF?text=NO+IMG'}" alt="${game.title || 'Game'}" class="game-thumb" onerror="this.src='https://via.placeholder.com/80x100/6c757d/FFFFFF?text=NO+IMG'"></td>
                            <td><a href="https://www.cheapshark.com/redirect?dealID=${game.dealID || ''}" target="_blank" class="game-title">${game.title || 'Unknown Title'}</a></td>
                            <td>${game.dealRating || 'N/A'}</td>
                            <td>${game.releaseDate > 0 ? new Date(game.releaseDate * 1000).toLocaleDateString() : '?'}</td>
                            <td>${game.metacriticScore !== '0' ? game.metacriticScore : '?'}</td>
                            <td>${timeSince(game.lastChange * 1000)} ago</td>
                        </tr>
                    `;
                    gamesListBody.append(gameRow);
                });
            }
        } catch (error) {
            console.error('Error displaying games:', error);
            displayError('Error displaying games. Please try again.');
        }
        updateCustomScrollbar(); // <-- PANGGIL UPDATE SCROLLBAR DI SINI
    }
    // Function to calculate time since
    function timeSince(date) {
        const seconds = Math.floor((new Date() - date) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutes";
        return Math.floor(seconds) + " seconds";
    }

    // Fungsi processStoreData ...
    function processStoreData(data, storesData) {
        const storeMap = {};
        storesData.forEach(store => {
            if (store.isActive) {
                storeMap[store.storeID] = { name: store.storeName };
            }
        });

        data.forEach(game => {
            if (storeMap[game.storeID]) {
                game.storeName = storeMap[game.storeID].name;
            } else {
                game.storeName = 'Unknown Store';
            }
        });

        allFetchedGames = data; // <-- 2. SIMPAN DATA ASLI
        
        applyFiltersAndDisplay(); // <-- PANGGIL FUNGSI FILTER BARU
    }

    // Fungsi handleStoreError ... (ubah displayGames menjadi applyFiltersAndDisplay)
    function handleStoreError(data, error) {
        console.error('Error fetching stores:', error);
        data.forEach(game => { game.storeName = `Store ID: ${game.storeID}`; });
        allFetchedGames = data;
        applyFiltersAndDisplay();
    }

    // Function to handle API error
    function handleApiError(xhr, status, error, context) {
        console.error(`Error ${context}:`, error);
        let errorMessage = `Error ${context}. `;

        if (status === 'timeout') {
            errorMessage += 'Request timed out. Please check your internet connection.';
        } else if (status === 'error') {
            errorMessage += 'Server error. Please try again later.';
        } else if (xhr.status === 404) {
            errorMessage += context === 'searching games' ? 'No results found for your search.' : 'API endpoint not found.';
        } else if (xhr.status === 403) {
            errorMessage += 'Access denied. Please try again later.';
        } else {
            errorMessage += 'Please try again later.';
        }

        displayError(errorMessage, false);
    }

    // Function to fetch store data
    function fetchStoreData(data) {
        $.ajax({
            url: 'https://www.cheapshark.com/api/1.0/stores',
            type: 'GET',
            dataType: 'json',
            timeout: 10000,
            success: function(storesData) {
                processStoreData(data, storesData);
                toggleLoadingScreen(false); // Hide loading screen after data is processed
            },
            error: function(xhr, status, error) {
                handleStoreError(data, error);
                toggleLoadingScreen(false); // Hide loading screen on error
            }
        });
        toggleLoadingScreen(false);
    }

    // Function to load initial deals
    function loadInitialDeals() {
        $('#search-input').val('');
        toggleLoadingScreen(true); // Show loading screen
        $.ajax({
            url: 'https://www.cheapshark.com/api/1.0/deals',
            type: 'GET',
            dataType: 'json',
            timeout: 10000,
            success: function(data) {
                fetchStoreData(data);
            },
            error: function(xhr, status, error) {
                handleApiError(xhr, status, error, 'loading games');
                toggleLoadingScreen(false); // Hide loading screen on error
            }
        });
    }

    // Search functionality
    $('#search-button').on('click', function() {
        const searchQuery = $('#search-input').val();

        if (!searchQuery) {
            loadInitialDeals();
            return;
        }

        toggleLoadingScreen(true); // Show loading screen
        $.ajax({
            url: 'https://www.cheapshark.com/api/1.0/deals',
            type: 'GET',
            dataType: 'json',
            data: {
                'title': searchQuery,
            },
            timeout: 10000,
            success: function(data) {
                if (!data || data.length === 0) {
                    displayError('No games found. Please try a different search term.');
                    toggleLoadingScreen(false); // Hide loading screen
                    return;
                }
                fetchStoreData(data);
            },
            error: function(xhr, status, error) {
                handleApiError(xhr, status, error, 'searching games');
                toggleLoadingScreen(false); // Hide loading screen on error
            }
        });
    });

    // Search on Enter key press
    $('#search-input').on('keypress', function(e) {
        if (e.key === 'Enter') {
            $('#search-button').click();
        }
    });

    // Reset page when clicking Games navbar link
    $('.navbar-brand').on('click', function(e) {
        e.preventDefault();
        loadInitialDeals();
    });

        // == 3. FUNGSI FILTER BARU ==
    // ==========================================================
    function applyFiltersAndDisplay() {
        const minDiscount = parseInt($('#discount-slider').val(), 10);

        const filteredGames = allFetchedGames.filter(game => {
            const savings = Math.round(parseFloat(game.savings || 0));
            return savings >= minDiscount;
        });

        // Jika hasil fetch asli 0 (error atau no result), biarkan displayError yg handle.
        // Jika hasil fetch ada tapi filter 0, tampilkan pesan.
        if (filteredGames.length === 0 && allFetchedGames.length > 0) {
             $('#games-list-body').html(`
                <tr>
                    <td colspan="9" class="text-center">
                       <div class="no-games-message">
                           <p>No games found with ${minDiscount}% discount or higher.</p>
                           <button class="btn btn-navy mt-3" id="reset-filters">Reset Filters</button>
                       </div>
                    </td>
                </tr>`);
             $('#custom-table-scrollbar').removeClass('visible');
        } else {
            displayGames(filteredGames);
        }
    }

    // ==========================================================
    // == 4. EVENT LISTENER UNTUK SLIDER ==
    // ==========================================================
    $('#discount-slider').on('input', function() {
        const value = $(this).val();
        $('#discount-value').text(value + '%');
        applyFiltersAndDisplay(); // Panggil filter setiap kali slider digerakkan
    });

    // Event listener untuk tombol reset (opsional, jika ingin)
    $(document).on('click', '#reset-filters', function() {
        $('#discount-slider').val(0);
        $('#discount-value').text('0%');
        loadInitialDeals(); // Muat ulang data awal
    });

    loadInitialDeals(); 

    // IMPROVED Music Control Functionality
    const audio = document.getElementById('backsound');
    const musicControlBtn = document.getElementById('music-control');

    // Fungsi untuk memperbarui tampilan dan status tombol
    function updateMusicButtonState() {
        if (isPlaying) {
            musicControlBtn.innerHTML = '<i class="fas fa-volume-up"></i>'; // Ikon saat musik ON
            musicControlBtn.classList.remove('muted');
            musicControlBtn.classList.add('playing');
            musicControlBtn.title = 'Pause Music';
        } else {
            musicControlBtn.innerHTML = '<i class="fas fa-volume-mute"></i>'; // Ikon saat musik OFF
            musicControlBtn.classList.remove('playing');
            musicControlBtn.classList.add('muted');
            musicControlBtn.title = 'Play Music';
        }
    }

    // Fungsi untuk toggle (mengubah) status play/pause
    function toggleMusic() {
        if (isPlaying) {
            audio.pause();
            // isPlaying akan diubah oleh event 'onpause'
        } else {
            // Mencoba memainkan audio dan menangani jika gagal (misal: browser blokir)
            audio.play().catch(error => {
                console.warn("Music play failed, possibly due to browser policy:", error);
                isPlaying = false; // Pastikan status kembali false jika gagal play
                updateMusicButtonState();
            });
            // isPlaying akan diubah oleh event 'onplay'
        }
    }

    // Menambahkan event listener ke tombol
    musicControlBtn.addEventListener('click', toggleMusic);

    // Menambahkan event listener ke audio untuk sinkronisasi status
    audio.onplay = () => {
        isPlaying = true;
        updateMusicButtonState();
    };

    audio.onpause = () => {
        isPlaying = false;
        updateMusicButtonState();
    };

    // Mencoba autoplay saat halaman dimuat (mungkin diblokir browser)
    let playPromise = audio.play();
    if (playPromise !== undefined) {
        playPromise.then(_ => {
            // Autoplay berhasil
            console.log("Audio is playing automatically.");
        }).catch(error => {
            // Autoplay gagal/diblokir, tunggu klik pengguna
            console.warn("Autoplay was prevented. Waiting for user interaction.");
            audio.pause(); // Pastikan dalam status pause
        });
    }

    // Set status awal tombol berdasarkan keadaan audio saat ini
    isPlaying = !audio.paused;
    updateMusicButtonState();

    // == CUSTOM FLOATING SCROLLBAR LOGIC ==
    const tableContainer = $('.table-responsive');
    const customScrollbar = $('#custom-table-scrollbar');
    const customThumb = $('.custom-scrollbar-thumb');

    let isDragging = false;
    let startX;
    let scrollLeftStart;

    function updateCustomScrollbar() {
        // Hanya jalankan jika elemen ada & kita di mobile view (atau jika tabel bisa scroll)
        if (tableContainer.length === 0 || customScrollbar.length === 0 || window.innerWidth > 768) {
             customScrollbar.removeClass('visible should-display');
             return;
        }

        const scrollWidth = tableContainer[0].scrollWidth;
        const clientWidth = tableContainer[0].clientWidth;

        // Cek apakah tabel bisa di-scroll
        if (scrollWidth > clientWidth) {
            customScrollbar.addClass('should-display'); // Tandai bahwa ia boleh muncul
            customScrollbar.addClass('visible'); // Tampilkan

            const scrollbarWidth = customScrollbar.width();
            let thumbWidth = (clientWidth / scrollWidth) * scrollbarWidth;
            thumbWidth = Math.max(thumbWidth, 30); // Pastikan thumb tidak terlalu kecil

            const maxScrollLeft = scrollWidth - clientWidth;
            const maxThumbLeft = scrollbarWidth - thumbWidth;

            // Hindari pembagian dengan nol jika maxScrollLeft = 0
            const thumbPos = (maxScrollLeft > 0)
                           ? (tableContainer[0].scrollLeft / maxScrollLeft) * maxThumbLeft
                           : 0;

            customThumb.css({
                'width': thumbWidth + 'px',
                'left': thumbPos + 'px'
            });

        } else {
            customScrollbar.removeClass('visible'); // Sembunyikan jika tidak bisa scroll
            // Biarkan 'should-display' jika masih di mobile, atau hapus jika perlu
        }
    }

    // Panggil saat tabel di-scroll
    tableContainer.on('scroll', function() {
        if (!isDragging) { // Hanya update jika bukan karena drag kita
            updateCustomScrollbar();
        }
    });

    // Panggil saat ukuran window berubah
    $(window).on('resize', updateCustomScrollbar);

    // Fungsi Drag untuk Thumb
    customThumb.on('mousedown touchstart', function(e) {
        if(window.innerWidth > 768) return; // Jangan aktifkan drag di desktop

        isDragging = true;
        const touch = e.originalEvent.touches ? e.originalEvent.touches[0] : e;
        startX = touch.pageX - customThumb.position().left;
        $('body').css({'user-select': 'none', 'cursor': 'grabbing'}); // Cegah seleksi teks & ubah kursor
        e.preventDefault();
        e.stopPropagation();
    });

    $(document).on('mousemove touchmove', function(e) {
        if (!isDragging || window.innerWidth > 768) return;
        e.preventDefault();
        e.stopPropagation();

        const touch = e.originalEvent.touches ? e.originalEvent.touches[0] : e;
        const x = touch.pageX;
        const scrollbarOffsetLeft = customScrollbar.offset().left;
        const scrollbarWidth = customScrollbar.width();
        const thumbWidth = customThumb.width();

        let newLeft = x - scrollbarOffsetLeft - startX;

        // Batasi pergerakan thumb
        newLeft = Math.max(0, newLeft); // Tidak boleh < 0
        newLeft = Math.min(newLeft, scrollbarWidth - thumbWidth); // Tidak boleh > max

        customThumb.css('left', newLeft + 'px');

        // Update scroll tabel berdasarkan posisi thumb
        const scrollRatio = newLeft / (scrollbarWidth - thumbWidth);
        const newScrollLeft = scrollRatio * (tableContainer[0].scrollWidth - tableContainer[0].clientWidth);
        tableContainer[0].scrollLeft = newScrollLeft;
    });

    $(document).on('mouseup touchend', function() {
        if (isDragging) {
            isDragging = false;
            $('body').css({'user-select': '', 'cursor': ''});
        }
    });

    setTimeout(updateCustomScrollbar, 500); // Beri sedikit jeda agar tabel sempat render

}); // Penutup $(document).ready
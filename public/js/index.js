import '@babel/polyfill';
import { displayMap } from './leaflet';
import { login, logout } from './login';
import { updateSettings } from './updateSettings';
import { signup } from './signup';

// DOM ELEMENTS
const leaflet = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');
const payBtn = document.getElementById('pay-btn');
const paymentForm = document.getElementById('mock-payment-form');
const signupForm = document.querySelector('.form--signup');

// DELEGATION
if (leaflet) {
    const locations = JSON.parse(leaflet.dataset.locations);
    displayMap(locations);
}

if (loginForm)
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email, password);
    });

if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (userDataForm)
    userDataForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const form = new FormData();
        form.append('name', document.getElementById('name').value);
        form.append('email', document.getElementById('email').value);
        form.append('photo', document.getElementById('photo').files[0]);

        updateSettings(form, 'data');
    });
if (userPasswordForm)
    userPasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        document.querySelector('.btn--save-password').textContent =
            'Updating...';

        const passwordCurrent =
            document.getElementById('password-current').value;
        const password = document.getElementById('password').value;
        const passwordConfirm =
            document.getElementById('password-confirm').value;
        await updateSettings(
            { passwordCurrent, password, passwordConfirm },
            'password'
        );

        document.querySelector('.btn--save-password').textContent =
            'Save password';
        document.getElementById('password-current').value = '';
        document.getElementById('password').value = '';
        document.getElementById('password-confirm').value = '';
    });

if (bookBtn) {
    bookBtn.addEventListener('click', async (e) => {
        e.target.textContent = 'Processing...';
        const tourId = e.target.dataset.tourId;
        try {
            const res = await fetch(
                `/api/v1/booking/checkout-session/${tourId}`
            );
            const data = await res.json();
            // Pass user, tour, price as state to the checkout page
            const { user, tour, price, session } = data;
            // Store booking data in sessionStorage
            sessionStorage.setItem(
                'bookingData',
                JSON.stringify({ user, tour, price })
            );
            window.location.href = session.success_url;
        } catch (err) {
            e.target.textContent = 'Book tour now!';
            alert('Error booking the tour. Please try again.');
        }
    });
}

// Handle mock payment on booking checkout page
if (payBtn && paymentForm) {
    // Get booking data from sessionStorage
    const bookingData = JSON.parse(sessionStorage.getItem('bookingData'));
    if (bookingData) {
        document.getElementById('tourName').textContent = bookingData.tour.name;
        document.getElementById(
            'tourPrice'
        ).textContent = `$${bookingData.price.toLocaleString()}`;
        document.getElementById('tourSummary').textContent =
            bookingData.tour.summary;
        document.getElementById(
            'tourImage'
        ).src = `/img/tours/${bookingData.tour.imageCover}`;
        document.getElementById('email').value = bookingData.user.email;
        document.getElementById('name').value = bookingData.user.name;
    }
    document.getElementById('pay-btn').onclick = async function () {
        if (!bookingData) return alert('Booking data missing!');
        this.textContent = 'Processing...';
        this.disabled = true;
        try {
            const tourId = bookingData.tour._id;
            const userId = bookingData.user._id;
            const price = bookingData.price;
            if (tourId && userId && price) {
                alert('Booked!');
                window.location.href = `/my-tours/?tour=${tourId}&user=${userId}&price=${price}`;
            } else {
                alert('Booking failed.');
            }
        } catch (err) {
            alert('Booking failed.');
        }
        this.textContent = 'Pay';
        this.disabled = false;
    };
}

if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const passwordConfirm =
            document.getElementById('passwordConfirm').value;
        await signup(name, email, password, passwordConfirm);
    });
}

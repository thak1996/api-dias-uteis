## How to use

[api-dias-uteis.netlify.app](https://api-weekdays.netlify.app/.netlify/functions/api/)

# Install
npm install -g netlify-cli
# Login 
npm install -g netlify-cli
# Deploy 
netlify deploy --prod

### Endpoints

- **GET** https://api-weekdays.netlify.app/.netlify/functions/api/{year}

Returns data about the working days of the specified year.

- **GET** https://api-weekdays.netlify.app/.netlify/functions/api/{year}/{month}

Returns data about the working days of a specific month, from a specific year.

---

Future features:

- Endpoints to handle retrieving data about working days between specific dates
- Improvements on the API's data retrieving (working days, sundays and holidays)
- Adding RN's local holidays

- ## About the Author

[GitHub - Natham Fernandes](https://github.com/NathamFernandes)
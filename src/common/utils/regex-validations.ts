export const validEmpty = (value: string) => (value ? false : true);

export const validEmail = (email: string) =>
	!email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i);

export const validSize = (size: number) => size < 6 || size > 20;

export const validCompanyName = (name: string): boolean =>
	!name.match(/^[A-Za-z0-9 ,._&'-]+$/);

export const validRif = (rif: string): boolean =>
	!rif.match(/^[J]-?[0-9]{8}-?[0-9]$/);

export const validControlledRif = (rif: string): boolean =>
	!rif.match(/^[0-9]{8}-?[0-9]$/);

export const validDocument = (document: string): boolean =>
	!document.match(/^[V]-?[0-9]{8}$/);

export const validControlledDocument = (document: string): boolean =>
	!document.match(/^[0-9]{7,8}$/);

export const validCedula = (cedula: string): boolean =>
	!cedula.match(/^[0-9]{7,8}$/);

export const validPhone = (phone: string): boolean =>
	!phone.match(/^[0-9]{10,11}$/i);

export const validPassword = (password: string): boolean =>
	!password.match(
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/
	);

export const validName = (name: string) =>
	!name.match(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'´]{3,}$/i);

export const validDeparmentName = (name: string) =>
	!name.match(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'´.-]+(\s?[0-9]*).{1,}$/i);

export const validDescription = (name: string) =>
	!name.match(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'´,.!?]+(\s?[0-9]*).{1,}$/i);

export const validDate = (date: string) =>
	!date.match(/^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/i);

export const validStatus = (status: string) =>
	!status.match(/^(Activo|Inactivo|activo|inactivo)$/i);

export const validSexo = (sexo: string) =>
	!sexo.match(/^(Masculino|Femenino|Otros)$/i);

export const validNumber = (reference: string, amount: number = 0): boolean => {
	if (amount === 0) {
		return /^[0-9]+$/.test(reference);
	}
	return new RegExp(`^[0-9]{${amount}}$`).test(reference);
};

/**
 * validCardNumber
 *
 * Validates if the card number is not a 16 digit number
 *
 * @param cardNumber  Card number to validate
 * @returns
 */
export const validCardNumber = (cardNumber: string): boolean =>
	!cardNumber.match(/^[0-9]{15,19}$/);

/**
 * validMonth
 *
 * Validates if the month is not a valid month (01-12)
 *
 * @param {string} month  Month to validate
 * @returns
 */
export const validMonth = (month: string): boolean =>
	!month.match(/^(0[1-9]|1[0-2])$/);

/**
 * validDay
 *
 * Validates if the day is not a valid day (01-31)
 *
 * @param {string} day - Day to validate
 * @returns
 */

export const validDay = (day: string): boolean =>
	!day.match(/^(0[1-9]|1\d|2\d|3[01])$/);

export const validYear = (year: string): boolean => !year.match(/^[0-9]{2}$/);

export const validCVC = (cvc: string): boolean => !cvc.match(/^[0-9]{3,4}$/);

export const isYearEqualOrGreater = (cvc: string): boolean =>
	!cvc.match(/^[0-9]{3,4}$/);

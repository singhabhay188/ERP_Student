'use server';
export async function adminSignIn({email,password}:{email:string,password:string}) {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    if(email === 'testing@gmail.com' && password === 'Tester@1234'){
        return true;
    }
    else throw new Error('Invalid email or password');
}
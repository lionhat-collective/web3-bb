import type { ActionFunction } from 'remix'
import { redirect } from 'remix'

const validQuestionSets = ['nfts', 'pop-culture']

// export const action: ActionFunction = async ({
//     request,
// }) => {
//     const form = await request.formData()
//     const questionSet = form.get('question-set')
//     if (typeof questionSet !== 'string' || !validQuestionSets.includes(questionSet)) {
//         throw new Error('Invalid question set submitted')
//     }

//     try {
//         // const createdRadlib = await radlib.save({ useMasterKey: true })
//         // return redirect(`/radlib/${createdRadlib.id}`)
//     } catch (err) {
//         if (err instanceof Error) {
//             console.log(err.message)
//         }
//         throw new Error('Failed to create radlib')
//     }
// }

function PostNewRoute() {
    return (
        <div>
            Create radlib game
            <form method="post">
                <div>
                    <label>Question Set: 
                        <select name="question-set">
                            <option value='nfts'>NFTs</option>
                            <option value='pop-culture'>Pop Culture</option>
                        </select>
                    </label>
                </div>
                <div>
                    <button type="submit">Create</button>
                </div>
            </form>
        </div>
    )
}

export default PostNewRoute;